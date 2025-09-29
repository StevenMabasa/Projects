import java.util.Scanner;
import java.util.Vector;

public class Union {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            int N;
            int M;
            int num;

            System.out.print("N : ");
            N = scanner.nextInt();

            System.out.print("M : ");
            M = scanner.nextInt();

            Vector<Integer> vec1 = new Vector<Integer>();
            System.out.println("vec1 :");
            for (int i=0; i<N; i++) {
                num = scanner.nextInt();
                vec1.add(num);
            }

            Vector<Integer> vec2 = new Vector<Integer>();
            System.out.println("vec2 :");
            for (int j=0; j<M; j++) {
                num = scanner.nextInt();
                vec2.add(num);
            }

            Vector<Integer> union = new Vector<Integer>();
            
            if (N >= M) {
                for (int k=0; k<vec1.size(); k++) {
                    for (int x=0; x<vec2.size(); x++) {
                        if (vec1.elementAt(k)==vec2.elementAt(x)){
                            union.add(vec1.elementAt(k));
                        }
                    }
                }

                /*for (int q=0; q<union.size(); q++) {
                    System.out.println(union.elementAt(q));
                }*/

                for (int a=0; a<vec1.size(); a++) {
                    if (union.contains(vec1.elementAt(a))) {
                        continue;
                    }
                    else {
                        union.add(vec1.elementAt(a));
                    }
                }

                /*for (int q=0; q<union.size(); q++) {
                    System.out.println(union.elementAt(q));
                }*/
                
                for (int c=0; c<vec2.size(); c++) {
                    if (union.contains(vec2.elementAt(c))) {
                        continue;
                    }
                    else {
                        union.add(vec2.elementAt(c));
                    }
                }
            }

            else {
                for (int k=0; k<vec2.size(); k++) {
                    for (int x=0; x<vec1.size(); x++) {
                        if (vec2.elementAt(k)==vec1.elementAt(x)) {
                            union.add(vec2.elementAt(k));
                        }
                    }
                }

                for (int a=0; a<vec1.size(); a++) {
                    if (union.contains(vec1.elementAt(a))) {
                        continue;
                    }
                    else {
                        union.add(vec1.elementAt(a));
                    }
                }

                for (int c=0; c<vec2.size(); c++) {
                    if (union.contains(vec2.elementAt(c))) {
                        continue;
                    }
                    else {
                        union.add(vec2.elementAt(c));
                    }
                }
            }

            System.out.print("UNION : [ ");
            for (int s=0; s<union.size(); s++) {
                System.out.print(union.elementAt(s));
                System.out.print(" ");
            }
            System.out.println("]");

            System.out.print("SIZE : ");
            System.out.println(union.size());
        }
    }
}
