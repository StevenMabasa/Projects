import java.util.Scanner;
import java.util.Vector;
/*import java.util.Collections;*/

public class Isequal {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            int num;
            int total;

            total = scanner.nextInt();

            Vector<Integer> mylist1 = new Vector<Integer>();
            Vector<Integer> mylist2 = new Vector<Integer>();

            System.out.println("mylist1 : ");

            for (int i=0; i<total; i++) {
                num = scanner.nextInt();
                mylist1.add(num);
            }

            System.out.println("mylist2 : ");

            for (int j=0; j<total; j++) {
                num = scanner.nextInt();
                mylist2.add(num);
            }

            /*Collections.sort(mylist1);   //NOT NECCESSARY TO SORT THE VECTORS
            Collections.sort(mylist2);*/

            for (int k=0; k<mylist1.size(); k++) {
                if (mylist2.contains(mylist1.elementAt(k))) {
                    if (k==mylist1.size()-1) {
                        System.out.println("True");
                    }
                    else {
                        continue;
                    }
                }

                else {
                    System.out.println("False");
                    break;
                }
            }
        }
    }
}
