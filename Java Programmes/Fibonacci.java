import java.util.*;

public class Fibonacci {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            ArrayList<Integer> sequence = new ArrayList<Integer>();
            int N = scanner.nextInt();
            int num;

            if (N==1) {
                num = 1;
                System.out.print("[");
                System.out.print(num);
                System.out.println("]");
            }

            else if (N==2) {
                num = 1;
                System.out.print("[");
                System.out.print(num);
                System.out.print(",");
                System.out.print(num);
                System.out.println("]"); 
            }

            else {
                sequence.add(1);
                sequence.add(1);

                for (int i=1; i<N-1; i++) {
                    num = sequence.get(i) + sequence.get(i-1);
                    sequence.add(num);
                }

                System.out.print("[");
                
                for (int j=0; j<sequence.size(); j++){
                    System.out.print(sequence.get(j));
                    if (j != sequence.size()-1) {
                        System.out.print(",");
                    }
                }

                System.out.println("]");
            }
        }
    }
}
